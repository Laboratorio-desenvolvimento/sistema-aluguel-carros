import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard", "routes/dashboard-layout.tsx", [
    index("routes/dashboard-home.tsx"),
    route("pedidos", "routes/dashboard-pedidos.tsx"),
    route("contratos", "routes/dashboard-contratos.tsx"),
    route("history", "routes/dashboard-history.tsx"),
  ]),
  route("cadastro-veiculo", "routes/cadastro-veiculo.tsx"),
  route("pedidos", "routes/pedidos.tsx"),
  route("cadastro", "routes/cadastro.tsx"),
  route("veiculos", "routes/veiculos.tsx"),
] satisfies RouteConfig;
