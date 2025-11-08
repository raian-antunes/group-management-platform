const ErrorMessage = ({
  id,
  message,
}: {
  id: string
  message: string[] | undefined
}) => {
  if (!message) return null

  return (
    <p id={id} className="text-sm text-red-500">
      {message[0]}
    </p>
  )
}

export default ErrorMessage
