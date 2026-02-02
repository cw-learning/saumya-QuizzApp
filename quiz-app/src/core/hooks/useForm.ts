import {
  useState,
  useCallback,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'

import type {
  ValidationSchemaType,
  FormErrorsType,
  FormTouchedType,
} from './types/useForm.types'

export interface UseFormProps<FormValuesType> {
  initialValues: FormValuesType
  validationSchema?: ValidationSchemaType<FormValuesType>
  onSubmit: (values: FormValuesType) => void | Promise<void>
}

export function useForm<
  FormValuesType extends Record<string, unknown>
>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<FormValuesType>) {
  const schema: ValidationSchemaType<FormValuesType> = useMemo(
    () => validationSchema ?? {},
    [validationSchema]
  )

  const [values, setValues] = useState<FormValuesType>(initialValues)
  const [errors, setErrors] = useState<FormErrorsType<FormValuesType>>({})
  const [touched, setTouched] = useState<FormTouchedType<FormValuesType>>({})

  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const fieldName = event.target.name as keyof FormValuesType

      setValues((prev) => ({
        ...prev,
        [fieldName]: event.target.value,
      }))

      if (errors[fieldName]) {
        setErrors((prevErrors: FormErrorsType<FormValuesType>) => {
          const updatedErrors = { ...prevErrors }
          delete updatedErrors[fieldName]
          return updatedErrors
        })
      }
    },
    [errors]
  )

  const handleBlur = useCallback(
    (
      event: FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const fieldName = event.target.name as keyof FormValuesType

      setTouched((prevTouched: FormTouchedType<FormValuesType>) => ({
        ...prevTouched,
        [fieldName]: true,
      }))

      const validator = schema[fieldName]
      if (validator) {
        const error = validator(
          event.target.value as FormValuesType[keyof FormValuesType]
        )

        if (error) {
          setErrors((prevErrors: FormErrorsType<FormValuesType>) => ({
            ...prevErrors,
            [fieldName]: error,
          }))
        }
      }
    },
    [schema]
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const updatedErrors: FormErrorsType<FormValuesType> = {}
      const updatedTouched: FormTouchedType<FormValuesType> = {}

      ;(Object.keys(schema) as Array<keyof FormValuesType>).forEach(
        (fieldName) => {
          updatedTouched[fieldName] = true

          const validator = schema[fieldName]
          if (validator) {
            const error = validator(values[fieldName])
            if (error) {
              updatedErrors[fieldName] = error
            }
          }
        }
      )

      setErrors(updatedErrors)
      setTouched(updatedTouched)

      if (Object.keys(updatedErrors).length === 0) {
        await onSubmit(values)
      }
    },
    [values, schema, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldValue = useCallback(
    <FieldName extends keyof FormValuesType>(
      fieldName: FieldName,
      value: FormValuesType[FieldName]
    ) => {
      setValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }))
    },
    []
  )

  const setFieldError = useCallback(
    <FieldName extends keyof FormValuesType>(
      fieldName: FieldName,
      error: string
    ) => {
      setErrors((prev: FormErrorsType<FormValuesType>) => ({
        ...prev,
        [fieldName]: error,
      }))
    },
    []
  )

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}