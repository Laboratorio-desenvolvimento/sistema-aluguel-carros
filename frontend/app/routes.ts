import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("pedidos", "routes/pedidos.tsx"),
  route("cadastro", "routes/cadastro.tsx"),
  route("veiculos", "routes/veiculos.tsx"),
] satisfies RouteConfig;
