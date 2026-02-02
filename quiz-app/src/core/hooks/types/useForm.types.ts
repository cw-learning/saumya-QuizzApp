export type FieldValidatorType<FieldValue> = (
  value: FieldValue
) => string | undefined;

export type ValidationSchemaType<FormValuesType> = {
  [FieldName in keyof FormValuesType]?: FieldValidatorType<
    FormValuesType[FieldName]
  >;
};

export type FormErrorsType<FormValuesType> = Partial<
  Record<keyof FormValuesType, string>
>;

export type FormTouchedType<FormValuesType> = Partial<
  Record<keyof FormValuesType, boolean>
>;