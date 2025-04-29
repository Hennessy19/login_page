export interface ValidationRule {
    type: ValidationRuleType;
    value?: any;
    message: string;
  }
  
  export enum ValidationRuleType {
    Required = 'required',
    MinLength = 'minLength',
    MaxLength = 'maxLength',
    Email = 'email',
    Pattern = 'pattern',
    Phone = 'phone',
    Password = 'password',
    Custom = 'custom'
  }
  
  export interface FieldConfig {
    name: string;
    rules: ValidationRule[];
  }
  
  export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string[]>;
  }