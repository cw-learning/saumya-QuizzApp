export type FieldValidator<FieldValue> = (
  value: FieldValue
) => string | undefined;

export type ValidationSchema<FormValues> = {
  [FieldName in keyof FormValues]?: FieldValidator<
    FormValues[FieldName]
  >;
};

export type FormErrors<FormValues> = Partial<
  Record<keyof FormValues, string>
>;

export type FormTouched<FormValues> = Partial<
  Record<keyof FormValues, boolean>
>;
