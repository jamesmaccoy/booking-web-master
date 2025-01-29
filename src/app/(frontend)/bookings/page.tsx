import { getPayload, Where } from 'payload'
import config from '@payload-config'
import React from 'react'
import { Post, User } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import PageClient from './page.client'
import BookingCard from '../../../components/Bookings/BookingCard'
import { redirect } from 'next/navigation'

export default async function Bookings() {
  const currentUser = await getMeUser()

  if (!currentUser) {
    redirect('/login')
  }

  const [upcomingBookings, pastBookings] = await Promise.all([
    getBookings('upcoming', currentUser.user),
    getBookings('past', currentUser.user),
  ])

  const formattedUpcomingBookings = upcomingBookings.docs.map((booking) => ({
    ...(booking.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: booking.fromDate,
    toDate: booking.toDate,
    guests: booking.guests,
    id: booking.id,
  }))

  const formattedPastBookings = pastBookings.docs.map((booking) => ({
    ...(booking.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: booking.fromDate,
    toDate: booking.toDate,
    guests: booking.guests,
    id: booking.id,
  }))

  console.log(upcomingBookings, pastBookings)

  return (
    <>
      <PageClient />
      <div className="my-10 container space-y-10">
        <div>
          {upcomingBookings.docs.length > 0 && (
            <h2 className="text-4xl font-medium tracking-tighter my-6">Upcoming stays</h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {formattedUpcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        {pastBookings.docs.length > 0 && (
          <h2 className="text-4xl font-medium tracking-tighter my-6">Past stays</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {formattedPastBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  )
}

const getBookings = async (type: 'upcoming' | 'past', currentUser: User) => {
  const payload = await getPayload({ config })

  let whereQuery: Where

  if (type === 'upcoming') {
    whereQuery = {
      and: [
        {
          fromDate: {
            greater_than_equal: new Date(),
          },
        },
        {
          customer: {
            equals: currentUser.id,
          },
        },
      ],
    }
  } else {
    whereQuery = {
      and: [
        {
          fromDate: {
            less_than: new Date(),
          },
        },
        {
          customer: {
            equals: currentUser.id,
          },
        },
      ],
    }
  }

  const bookings = await payload.find({
    collection: 'bookings',
    limit: 100,
    where: whereQuery,
    depth: 2,
    sort: '-fromDate',
    select: {
      slug: true,
      post: true,
      guests: true,
      fromDate: true,
      toDate: true,
    },
  })

  return bookings
}
