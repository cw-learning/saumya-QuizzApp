import {
  useState,
  useCallback,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'

import type {
  ValidationSchema,
  FormErrors,
  FormTouched,
} from './types/useForm.types'

export interface UseFormProps<FormValues> {
  initialValues: FormValues
  validationSchema?: ValidationSchema<FormValues>
  onSubmit: (values: FormValues) => void | Promise<void>
}

export function useForm<
  FormValues extends Record<string, unknown>
>({
  initialValues,
  validationSchema = {},
  onSubmit,
}: UseFormProps<FormValues>) {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors<FormValues>>({})
  const [touched, setTouched] = useState<FormTouched<FormValues>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const fieldName = event.target.name as keyof FormValues

      setValues((previousValues) => ({
        ...previousValues,
        [fieldName]: event.target.value,
      }))

      if (errors[fieldName]) {
        setErrors((previousErrors) => {
          const updatedErrors = { ...previousErrors }
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
      const fieldName = event.target.name as keyof FormValues

      setTouched((previousTouched) => ({
        ...previousTouched,
        [fieldName]: true,
      }))

      const validator = validationSchema[fieldName]
      if (validator) {
        const error = validator(
          event.target.value as FormValues[keyof FormValues]
        )
        if (error) {
          setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: error,
          }))
        }
      }
    },
    [validationSchema]
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsSubmitting(true)

      try {
        const updatedErrors: FormErrors<FormValues> = {}
        const updatedTouched: FormTouched<FormValues> = {} as FormTouched<FormValues>

        (
          Object.keys(validationSchema) as Array<keyof FormValues>
        ).forEach((fieldName: keyof FormValues) => {
          updatedTouched[fieldName] = true

          const validator = validationSchema[fieldName]
          if (validator) {
            const error = validator(values[fieldName])
            if (error) {
              updatedErrors[fieldName] = error
            }
          }
        })

        setErrors(updatedErrors)
        setTouched(updatedTouched)

        if (Object.keys(updatedErrors).length === 0) {
          await onSubmit(values)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validationSchema, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const setFieldValue = useCallback(
    <FieldName extends keyof FormValues>(
      fieldName: FieldName,
      value: FormValues[FieldName]
    ) => {
      setValues((previousValues) => ({
        ...previousValues,
        [fieldName]: value,
      }))
    },
    []
  )

  const setFieldError = useCallback(
    <FieldName extends keyof FormValues>(
      fieldName: FieldName,
      error: string
    ) => {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [fieldName]: error,
      }))
    },
    []
  )

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}
