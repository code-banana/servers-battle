package main

import (
	"log"
	"net/http"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	metrics "github.com/slok/go-http-metrics/metrics/prometheus"
	"github.com/slok/go-http-metrics/middleware"
	"github.com/slok/go-http-metrics/middleware/std"
)

const (
	PORT        = ":8080"
	metricsAddr = ":8081"
)

func handleRequests() {
	mdlw := middleware.New(middleware.Config{
		Recorder: metrics.NewRecorder(metrics.Config{}),
	})
	mux := http.NewServeMux()
	mux.HandleFunc("/isAlive", PingReq)
	mux.HandleFunc("/find", FindReq)
	mux.HandleFunc("/insert", InsertReq)

	serv := std.Handler("", mdlw, mux)
	// Serve our metrics.
	go func() {
		log.Printf("metrics listening at %s", metricsAddr)
		if err := http.ListenAndServe(metricsAddr, promhttp.Handler()); err != nil {
			log.Panicf("error while serving metrics: %s", err)
		}
	}()
	log.Fatal(http.ListenAndServe(PORT, serv))
}

func main() {
	handleRequests()
}
