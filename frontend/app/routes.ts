import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("cadastro-cliente", "routes/cadastro-cliente.tsx"),
] satisfies RouteConfig;
