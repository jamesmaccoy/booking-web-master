import { adminOrSelf } from '@/access/adminOrSelf'
import { adminOrSelfField } from '@/access/adminOrSelfField'
import { isAdmin } from '@/access/isAdmin'
import { isAdminField } from '@/access/isAdminField'
import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'
import { adminOrSelfOrGuests } from './access/adminOrSelfOrGuests'

export const Policy: CollectionConfig = {
  slug: 'policys',
  labels: {
    singular: 'Policy',
    plural: 'Policys',
  },
  typescript: {
    interface: 'Policy',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'fromDate', 'toDate', 'slug', 'customer'],
  },
  access: {
    read: adminOrSelfOrGuests('customer', 'guests'),
    create: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'customer',
        },
      },
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'guests',
      type: 'relationship',
      hasMany: true,
      relationTo: 'users',
      access: {
        update: adminOrSelfField('customer'),
      },
      admin: {
        isSortable: true,
      },
    },
    ...slugField('title', {
      checkboxOverrides: {
        access: {
          update: isAdminField,
        },
      },
      slugOverrides: {
        access: {
          update: isAdminField,
        },
      },
    }),
    {
      name: 'post',
      relationTo: 'posts',
      type: 'relationship',
      required: true,
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'paymentStatus',
      label: 'Payment Status',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Unpaid',
          value: 'unpaid',
        },
      ],
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'fromDate',
      type: 'date',
      required: true,
      index: true,
      label: 'Check-in Date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'toDate',
      type: 'date',
      required: true,
      label: 'Check-out Date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      access: {
        update: isAdminField,
      },
    },
  ],
}
