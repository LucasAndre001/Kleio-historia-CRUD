import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  erro = signal(false);
  carregando = signal(false);

  form = this.fb.nonNullable.group({
    login: ['', Validators.required],
    senha: ['', Validators.required],
  });

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.carregando.set(true);
    this.erro.set(false);
    const { login, senha } = this.form.getRawValue();

    this.auth.login(login, senha).subscribe(ok => {
      this.carregando.set(false);
      if (ok) this.router.navigate(['/admin/painel']);
      else this.erro.set(true);
    });
  }
}
