import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

type Primitive = string | number | boolean | Date | null;

function isObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isPrimitiveArray(arr: any[]): boolean {
  return arr.every((v) => typeof v !== 'object' || v === null);
}

interface FormGenOptions<T> {
  editableFields?: (keyof T)[];
  requiredFields?: (keyof T)[];
  customValidators?: Partial<Record<keyof T, ValidatorFn[]>>;
}

export function createFormGroupFromDto<T>(
  dto: Partial<T>,
  options: FormGenOptions<T> = {},
): FormGroup {
  const controls: Record<string, AbstractControl> = {};
  const { editableFields, requiredFields, customValidators } = options;

  Object.keys(dto).forEach((k) => {
    const key = k as keyof T;
    const value = dto[key];
    const editable = !editableFields || editableFields.includes(key);
    const isRequired = requiredFields?.includes(key);
    const validators = [
      ...(isRequired ? [Validators.required] : []),
      ...(customValidators?.[key] ?? []),
    ];

    if (Array.isArray(value)) {
      if (isPrimitiveArray(value)) {
        controls[k] = new FormArray(
          (value as Primitive[]).map(
            (v) =>
              new FormControl(
                { value: v, disabled: !editable },
                { nonNullable: true, validators },
              ),
          ),
        );
      } else {
        controls[k] = new FormArray(
          (value as any[]).map((v) => createFormGroupFromDto(v)),
        );
      }
    } else if (isObject(value)) {
      controls[k] = createFormGroupFromDto(value);
    } else {
      controls[k] = new FormControl(
        { value: value as Primitive, disabled: !editable },
        { nonNullable: true, validators },
      );
    }
  });

  return new FormGroup(controls);
}
