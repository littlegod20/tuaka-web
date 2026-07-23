import { useEffect, useState } from 'react'
import { useTenant, useUpdateTenant, type TenantUpdatePayload } from '@tuaka/api-client'
import { Button, Input, ThemeSwitcher } from '@tuaka/ui'

export function SettingsPage() {
  const { data: tenant, isLoading } = useTenant()
  const { mutate: updateTenant, isPending, isSuccess } = useUpdateTenant()

  const [values, setValues] = useState<TenantUpdatePayload>({})
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (tenant) {
      setValues({
        name:           tenant.name,
        invoice_prefix: tenant.invoice_prefix,
        currency:       tenant.currency,
        timezone:       tenant.timezone,
        address:        tenant.address ?? '',
        phone:          tenant.phone ?? '',
        website:        tenant.website ?? '',
      })
    }
  }, [tenant?.id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    updateTenant(values, {
      onError: (err: any) =>
        setErrors(err?.response?.data?.errors ?? {}),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Manage your workspace settings
        </p>
      </div>

      <div className="mb-6 space-y-3 rounded-xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Appearance</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Light, dark, or match your device settings.
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Business info */}
        <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Business info</h2>
          <Input
            required
            label="Business name"
            name="name"
            value={values.name ?? ''}
            error={errors.name?.[0]}
            onChange={handleChange}
          />
          <Input
            label="Phone"
            name="phone"
            placeholder="+233 24 000 0000"
            value={values.phone ?? ''}
            error={errors.phone?.[0]}
            onChange={handleChange}
          />
          <Input
            label="Address"
            name="address"
            placeholder="123 Osu High Street, Accra"
            value={values.address ?? ''}
            error={errors.address?.[0]}
            onChange={handleChange}
          />
          <Input
            label="Website"
            name="website"
            placeholder="https://example.com"
            type="url"
            value={values.website ?? ''}
            error={errors.website?.[0]}
            onChange={handleChange}
          />
        </div>

        {/* Invoice settings */}
        <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Invoice settings</h2>
          <div>
            <Input
              required
              label="Invoice prefix"
              name="invoice_prefix"
              placeholder="INV"
              value={values.invoice_prefix ?? ''}
              error={errors.invoice_prefix?.[0]}
              hint="Uppercase letters, numbers, hyphens only. e.g. INV, TK, ACME-INV"
              onChange={(e) =>
                handleChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'invoice_prefix',
                    value: e.target.value.toUpperCase(),
                  },
                })
              }
            />
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Preview:{' '}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {values.invoice_prefix || 'INV'}-0001
              </span>
            </p>
          </div>
          <Input
            required
            label="Currency"
            name="currency"
            placeholder="GHS"
            value={values.currency ?? ''}
            error={errors.currency?.[0]}
            hint="3-letter ISO code e.g. GHS, USD, EUR"
            onChange={(e) =>
              handleChange({
                ...e,
                target: {
                  ...e.target,
                  name: 'currency',
                  value: e.target.value.toUpperCase(),
                },
              })
            }
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button loading={isPending} type="submit">
            Save changes
          </Button>
          {isSuccess && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Saved ✓
            </span>
          )}
        </div>
      </form>
    </div>
  )
}