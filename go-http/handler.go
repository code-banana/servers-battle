package main

import (
	"fmt"
	"net/http"
	"sync"
)

var mutex = &sync.RWMutex{}
var kvStore = map[string]string{}

func read(key string) (string, bool) {
	mutex.RLock()
	value, ok := kvStore[key]
	mutex.RUnlock()
	return value, ok
}

func write(key string, value string) {
	mutex.Lock()
	kvStore[key] = value
	mutex.Unlock()
}

func PingReq(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Boss is always fine: go")
}

func FindReq(w http.ResponseWriter, r *http.Request) {
	key := r.FormValue("key")
	value, ok := read(key)

	if ok == false {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error! key is not correct")
	}
	fmt.Fprintf(w, value)
}

func InsertReq(w http.ResponseWriter, r *http.Request) {
	key := r.FormValue("key")
	value := r.FormValue("value")
	if value == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error! key is not correct")
	}
	write(key, value)
	fmt.Fprintf(w, value)
}
