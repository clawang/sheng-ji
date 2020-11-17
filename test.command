#!/bin/bash
cd /Users/clairewang/sheng-ji
kill $(lsof -ti:8888)
node server/index.js & node client/test/google_test.js