import { useEffect } from 'react'
import { Button, Input } from '@tuaka/ui'
import type { ClientPayload } from '@tuaka/api-client'
import { useForm } from '../../hooks/useForm'
import type { Client } from '@tuaka/api-client'

interface ClientFormProps {
  initial?: Client
  loading?: boolean
  errors?: Record<string, string[]>
  onSubmit: (values: ClientPayload) => void
  onCancel: () => void
}

const empty: ClientPayload = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
}

export function ClientForm({
  initial,
  loading,
  errors = {},
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const { values, handleChange, setValues } = useForm<Record<string, string>>(
    initial
      ? {
          name: initial.name,
          email: initial.email ?? '',
          phone: initial.phone ?? '',
          company: initial.company ?? '',
          address: initial.address ?? '',
        }
      : { ...empty },
  )

  // Reset form when initial changes (switching between clients)
  useEffect(() => {
    if (initial) {
      setValues({
        name: initial.name,
        email: initial.email ?? '',
        phone: initial.phone ?? '',
        company: initial.company ?? '',
        address: initial.address ?? '',
      })
    }
  }, [initial?.id])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      company: values.company || undefined,
      address: values.address || undefined,
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        required
        autoFocus
        label="Name"
        name="name"
        placeholder="Ama Owusu"
        value={values.name}
        error={errors.name?.[0]}
        onChange={handleChange}
      />
      <Input
        label="Company"
        name="company"
        placeholder="Owusu Trading Ltd"
        value={values.company}
        error={errors.company?.[0]}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="ama@owusutrading.com"
        value={values.email}
        error={errors.email?.[0]}
        onChange={handleChange}
      />
      <Input
        label="Phone"
        name="phone"
        placeholder="+233 24 000 0000"
        value={values.phone}
        error={errors.phone?.[0]}
        onChange={handleChange}
      />
      <Input
        label="Address"
        name="address"
        placeholder="123 Osu High Street, Accra"
        value={values.address}
        error={errors.address?.[0]}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Save changes' : 'Add client'}
        </Button>
      </div>
    </form>
  )
}