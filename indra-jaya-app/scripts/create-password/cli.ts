#!/usr/bin/env bun
import { hashPassword } from './password'

const USAGE = 'Pemakaian: bunx create-password <password>'

const password = process.argv[2]

if (!password) {
  console.error(USAGE)
  process.exit(1)
}

console.log(await hashPassword(password))
