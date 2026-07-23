import { useEffect } from 'react'
import { Button, Input } from '@tuaka/ui'
import { fromPs, toPs } from '@tuaka/utils'
import type { Product, ProductPayload } from '@tuaka/api-client'
import { useForm } from '../../hooks/useForm'

interface ProductFormProps {
  initial?: Product
  loading?: boolean
  errors?: Record<string, string[]>
  onSubmit: (values: ProductPayload) => void
  onCancel: () => void
}

export function ProductForm({
  initial,
  loading,
  errors = {},
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const { values, handleChange, setValues } = useForm({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    price: initial ? fromPs(initial.default_price) : '',
  })

  useEffect(() => {
    if (initial) {
      setValues({
        name: initial.name,
        description: initial.description ?? '',
        price: fromPs(initial.default_price),
      })
    }
  }, [initial?.id])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name: values.name,
      description: values.description || undefined,
      default_price: toPs(values.price),
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        required
        autoFocus
        label="Product / service name"
        name="name"
        placeholder="Web design, Consultation, etc."
        value={values.name}
        error={errors.name?.[0]}
        onChange={handleChange}
      />

      {/* Price field */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Default price (GHS)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            GHS
          </span>
          <input
            required
            className={`w-full rounded-lg border px-3 py-2 pl-12 text-sm text-gray-900
              placeholder-gray-400 outline-none transition-colors
              focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20
              dark:bg-gray-900 dark:text-gray-100
              ${errors.default_price ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
            min="0"
            name="price"
            placeholder="0.00"
            step="0.01"
            type="number"
            value={values.price}
            onChange={handleChange}
          />
        </div>
        {errors.default_price && (
          <p className="text-xs text-red-500">{errors.default_price[0]}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description{' '}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
            text-gray-900 placeholder-gray-400 outline-none transition-colors
            focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 resize-none
            dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          name="description"
          placeholder="Brief description shown on invoices"
          rows={3}
          value={values.description}
          onChange={(e) =>
            handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description[0]}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Save changes' : 'Add product'}
        </Button>
      </div>
    </form>
  )
}