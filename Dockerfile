# syntax=docker/dockerfile:1

# Supports ARM + x86-64
# 'as base' allows us to refer to this build stage in other build stages
FROM node:18 as base
SHELL ["/bin/bash", "-c"]

# Set the root working dir inside container
# This way you do not have to type out full paths, you can use relative paths based on the working dir
WORKDIR "/app"
# Set layer caching for faster builds
# Runs only on package.json and package-lock.js change else uses cached Docker layers

# Refering to base, and adding new build stage label 'dev'
FROM base as dev
# Appends content of our .bashrc to container /root/.bashrc
# Copy rest of the projects source code to container env
COPY . .