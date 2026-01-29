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
  validationSchema,
  onSubmit,
}: UseFormProps<FormValues>) {
  const schema: ValidationSchema<FormValues> = validationSchema ?? {}

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

      const nextValue: unknown =
        event.target instanceof HTMLInputElement &&
        event.target.type === 'number'
          ? Number.isNaN(event.target.valueAsNumber)
            ? ''
            : event.target.valueAsNumber
          : event.target.value

      setValues((prev) => ({
        ...prev,
        [fieldName]: nextValue,
      }))

      if (errors[fieldName]) {
        setErrors((prevErrors) => {
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
      const fieldName = event.target.name as keyof FormValues

      setTouched((prevTouched) => ({
        ...prevTouched,
        [fieldName]: true,
      }))

      const validator = schema[fieldName]
      if (!validator) return

      const error = validator(
        event.target.value as FormValues[keyof FormValues]
      )

      if (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: error,
        }))
      }
    },
    [schema]
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsSubmitting(true)

      try {
        const updatedErrors: FormErrors<FormValues> = {}
        const updatedTouched: FormTouched<FormValues> = {}

        for (const fieldName of Object.keys(
          schema
        ) as Array<keyof FormValues>) {
          updatedTouched[fieldName] = true

          const validator = schema[fieldName]
          if (!validator) continue

          const error = validator(values[fieldName])
          if (error) {
            updatedErrors[fieldName] = error
          }
        }

        setErrors(updatedErrors)
        setTouched(updatedTouched)

        if (Object.keys(updatedErrors).length === 0) {
          await onSubmit(values)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, schema, onSubmit]
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
      setValues((prev) => ({
        ...prev,
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
      setErrors((prev) => ({
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
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}
