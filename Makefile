PORT ?= 5432
URL ?= http://localhost:$(PORT)/

.PHONY: run
run:
	@(sleep 0.5; open "$(URL)") &
	python3 -m http.server $(PORT)
