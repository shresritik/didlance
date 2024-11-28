export const useFetchUser = async () => {
  const userId = localStorage.getItem("userId");
  const data = await fetch("/api/users/" + userId);
  const res = data.json();
  console.log(res);
};
