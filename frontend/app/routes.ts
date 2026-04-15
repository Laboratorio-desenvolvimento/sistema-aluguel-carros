import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard-cliente", "routes/dashboard-cliente.tsx"),
  route("cadastro", "routes/cadastro.tsx"),
  route("veiculos", "routes/veiculos.tsx"),
  route("reservas-cliente", "routes/reservas-cliente.tsx"),
] satisfies RouteConfig;
