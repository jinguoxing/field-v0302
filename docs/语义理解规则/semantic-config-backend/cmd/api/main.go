package main

import (
  "flag"
  "fmt"

  "github.com/zeromicro/go-zero/core/conf"
  "github.com/zeromicro/go-zero/rest"

  "semantic-config-backend/internal/config"
  "semantic-config-backend/internal/handler"
  "semantic-config-backend/internal/svc"
)

func main() {
  var configFile = flag.String("f", "etc/semanticconfig.yaml", "the config file")
  flag.Parse()

  var c config.Config
  conf.MustLoad(*configFile, &c)

  server := rest.MustNewServer(c.RestConf)
  defer server.Stop()

  ctx := svc.NewServiceContext(c)
  handler.RegisterHandlers(server, ctx)

  fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)
  server.Start()
}
