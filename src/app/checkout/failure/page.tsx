import Link from 'next/link'

export default function FailurePage() {
  return (
    <div className="container py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red/10 text-2xl text-red">
          !
        </div>
        <h1 className="font-serif text-3xl">Payment not completed</h1>
        <p className="mt-3 text-inksoft">
          Your payment could not be completed or was cancelled. No amount was
          charged. Please try again.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/checkout" className="btn btn-primary">Try again</Link>
          <Link href="/shop" className="btn btn-outline">Back to shop</Link>
        </div>
      </div>
    </div>
  )
}
