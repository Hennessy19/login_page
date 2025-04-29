import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';
import { FieldConfig, ValidationRule, ValidationRuleType, ValidationResult } from '../../models/validation-rule';

@Component({
  selector: 'app-form-validator-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-validator-demo.component.html',
  styleUrls: ['./form-validator-demo.component.css']
})
export class FormValidatorDemoComponent implements OnInit {
  dynamicForm: FormGroup;
  submitted = false;
  validationResult: ValidationResult | null = null;
  
  // Define form field configurations
  fieldConfigs: FieldConfig[] = [
    {
      name: 'name',
      rules: [
        { type: ValidationRuleType.Required, message: 'Name is required' },
        { type: ValidationRuleType.MinLength, value: 3, message: 'Name must be at least 3 characters' }
      ]
    },
    {
      name: 'email',
      rules: [
        { type: ValidationRuleType.Required, message: 'Email is required' },
        { type: ValidationRuleType.Email, message: 'Please enter a valid email address' }
      ]
    },
    {
      name: 'phone',
      rules: [
        { type: ValidationRuleType.Phone, message: 'Please enter a valid phone number' }
      ]
    },
    {
      name: 'password',
      rules: [
        { type: ValidationRuleType.Required, message: 'Password is required' },
        { type: ValidationRuleType.MinLength, value: 8, message: 'Password must be at least 8 characters' },
        { type: ValidationRuleType.Password, message: 'Password must contain uppercase, lowercase, number and special character' }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService
  ) {
    // Initialize the form with validators
    const formConfig: Record<string, any> = {};
    
    this.fieldConfigs.forEach(fieldConfig => {
      formConfig[fieldConfig.name] = ['', this.validatorService.getValidators(fieldConfig.rules)];
    });
    
    this.dynamicForm = this.fb.group(formConfig);
  }

  ngOnInit(): void {}

  // Get field errors
  getFieldErrors(fieldName: string): string[] {
    const fieldConfig = this.fieldConfigs.find(fc => fc.name === fieldName);
    if (!fieldConfig) {
      return [];
    }
    return this.validatorService.validateField(this.dynamicForm.get(fieldName)!, fieldConfig.rules);
  }

  onSubmit(): void {
    this.submitted = true;
    
    this.validationResult = this.validatorService.validateForm(this.dynamicForm, this.fieldConfigs);
    
    if (this.validationResult.valid) {
      console.log('Form is valid!', this.dynamicForm.value);
      alert('Form submitted successfully!');
      this.dynamicForm.reset();
      this.submitted = false;
    } else {
      console.log('Form is invalid', this.validationResult.errors);
    }
  }
}