import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidationRule, ValidationRuleType, FieldConfig, ValidationResult } from '../models/validation-rule';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  
  constructor() { }

  getValidators(rules: ValidationRule[]): ValidatorFn[] {
    return rules.map(rule => this.createValidator(rule));
  }

  private createValidator(rule: ValidationRule): ValidatorFn {
    switch(rule.type) {
      case ValidationRuleType.Required:
        return Validators.required;
      case ValidationRuleType.MinLength:
        return Validators.minLength(rule.value);
      case ValidationRuleType.MaxLength:
        return Validators.maxLength(rule.value);
      case ValidationRuleType.Email:
        return Validators.email;
      case ValidationRuleType.Pattern:
        return Validators.pattern(rule.value);
      case ValidationRuleType.Phone:
        return Validators.pattern(/^\+?[0-9]{10,14}$/); // Basic phone validation
      case ValidationRuleType.Password:
        return this.passwordValidator();
      case ValidationRuleType.Custom:
        if (typeof rule.value === 'function') {
          return rule.value;
        }
        return Validators.nullValidator;
      default:
        return Validators.nullValidator;
    }
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
      
      const valid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
      
      return !valid ? { 'password': true } : null;
    };
  }

  validateField(control: AbstractControl, rules: ValidationRule[]): string[] {
    if (!control) {
      return [];
    }

    const errors: string[] = [];
    
    if (control.invalid && (control.dirty || control.touched)) {
      rules.forEach(rule => {
        switch(rule.type) {
          case ValidationRuleType.Required:
            if (control.errors?.['required']) {
              errors.push(rule.message);
            }
            break;
          case ValidationRuleType.MinLength:
            if (control.errors?.['minlength']) {
              errors.push(rule.message);
            }
            break;
          case ValidationRuleType.MaxLength:
            if (control.errors?.['maxlength']) {
              errors.push(rule.message);
            }
            break;
          case ValidationRuleType.Email:
            if (control.errors?.['email']) {
              errors.push(rule.message);
            }
            break;
          case ValidationRuleType.Pattern:
            if (control.errors?.['pattern']) {
              errors.push(rule.message);
            }
            break;
          case ValidationRuleType.Phone:
            if (control.errors?.['pattern']) {
              errors.push(rule.message);
            }
            break;
          case ValidationRuleType.Password:
            if (control.errors?.['password']) {
              errors.push(rule.message);
            }
            break;
          case ValidationRuleType.Custom:
            if (control.errors && typeof rule.value === 'function') {
              const errorKey = Object.keys(control.errors)[0];
              if (errorKey && errorKey !== 'required' && 
                  errorKey !== 'minlength' && errorKey !== 'maxlength' && 
                  errorKey !== 'email' && errorKey !== 'pattern' && 
                  errorKey !== 'password') {
                errors.push(rule.message);
              }
            }
            break;
        }
      });
    }
    
    return errors;
  }

  validateForm(form: FormGroup, fieldConfigs: FieldConfig[]): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: {}
    };

    fieldConfigs.forEach(fieldConfig => {
      const control = form.get(fieldConfig.name);
      const fieldErrors = this.validateField(control!, fieldConfig.rules);
      
      if (fieldErrors.length > 0) {
        result.valid = false;
        result.errors[fieldConfig.name] = fieldErrors;
      }
    });

    return result;
  }
}