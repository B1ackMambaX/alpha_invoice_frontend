import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { Center, Spinner } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@app/providers/store";
import { useGetMeQuery, logout } from "@entities/session";
import { AppRoute } from "./routes";

export const RequireAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.session.token);

  const { isLoading, isError } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isError) {
      dispatch(logout());
    }
  }, [isError, dispatch]);

  if (!token) return <Navigate to={AppRoute.Login} replace />;

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner color="brand" size="xl" />
      </Center>
    );
  }

  if (isError) return <Navigate to={AppRoute.Login} replace />;

  return <Outlet />;
};
