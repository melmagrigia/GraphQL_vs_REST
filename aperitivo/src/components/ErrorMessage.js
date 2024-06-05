export const ErrorMessage = (error) => {
  console.log(error);
  return (
    <div>
      <p>An error occurred: {error.message}</p>
    </div>
  );
};
