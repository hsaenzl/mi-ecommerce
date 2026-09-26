import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { 
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { ProductService } from '../../services/product-service';
import { stockAsyncValidator } from '../../validators/stock.validator';

function montoCoincideConTotal(cartService: CartService): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const monto = Number(grupo.get('montoIngresado')?.value);
    if (Number.isNaN(monto)) return null;

    const total = cartService.total();
    const tolerancia = 0.01;

    return Math.abs(monto - total) > tolerancia
      ? { montoNoCoincide: { monto, total } }
      : null;
  };
}

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);
  cartService = inject(CartService);

  checkoutForm = this.fb.group({
    envio: this.fb.group({
      nombreCompleto: ['', Validators.required],
      direccion: ['', Validators.required],
      usarOtraDireccion: [false],
      direccionAlternativa: [{ value: '', disabled: true }],
    }),
    pago: this.fb.group(
      {
        numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
        montoIngresado: [this.cartService.total(), [Validators.required, Validators.min(0)]],
      }, 
      { validators: montoCoincideConTotal(this.cartService) }
    ),
    items: this.fb.array(
      this.cartService.elementosCarrito().map((item) =>
        this.fb.group({
          id: [item.id],
          name: [item.name],
          cantidad: [
            item.amount,
            {
              validators: [Validators.required, Validators.min(1)],
              asyncValidators: [stockAsyncValidator(this.productService, item.id)],
              updateOn: 'blur',
            },
          ],
        })
      )
    ),
  });

  get envio() { return this.checkoutForm.get('envio') as FormGroup; }
  get pago() { return this.checkoutForm.get('pago') as FormGroup; }
  get items() { return this.checkoutForm.get('items') as FormArray; }
  
  get nombreCompleto() { return this.envio.get('nombreCompleto'); }
  get direccion() { return this.envio.get('direccion'); }
  get usarOtraDireccion() { return this.envio.get('usarOtraDireccion'); }
  get direccionAlternativa() { return this.envio.get('direccionAlternativa'); }
  get numeroTarjeta() { return this.pago.get('numeroTarjeta'); }
  get cvv() { return this.pago.get('cvv'); }
  get montoIngresado() { return this.pago.get('montoIngresado'); }

  constructor() {
    this.envio.get('usarOtraDireccion')?.valueChanges.subscribe((usar) => {
      const campo = this.envio.get('direccionAlternativa');
      if (usar) {
        campo?.enable();
      } else {
        campo?.disable();
        campo?.setValue('');
      }
    });
  }

  confirmarPedido() {
    if (this.checkoutForm.invalid || this.checkoutForm.pending) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.cartService.elementosCarrito().length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    console.log('Pedido confirmado', this.checkoutForm.getRawValue());
    alert('¡Gracias por tu compra!');
    this.cartService.vaciar();
    this.router.navigate(['/']);
  }
}


