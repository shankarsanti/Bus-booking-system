#!/bin/bash
cd frontend
npm ci
npm run build
cd ..
cp -r frontend/dist ./dist
