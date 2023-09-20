import axios, { AxiosInstance } from 'axios'

export const scenarioInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5100/api/scenarios',
})

export const containerImageInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5100/api/images',
})

export const environmentInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5100/api/environments',
})
