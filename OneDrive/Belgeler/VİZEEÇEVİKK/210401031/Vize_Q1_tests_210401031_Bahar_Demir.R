library(testthat)
source("Vize_Q1_tests_210401031_Bahar_Demir.R")


# Test 1.1
test_that("spotify_token variable exists", {
  expect_true(exists("spotify_token"))
})

# Test 1.2
test_that("spotify_token is a function", {
  expect_is(spotify_token, "function")  # "closure" yerine "function" kullanılmalı
})

# Test 1.3
test_that("output of spotify_token() is a list", {
  result <- spotify_token()
  expect_is(result, "list")
})

# Test 1.4
test_that("output of spotify_token() has two elements", {
  result <- spotify_token()
  expect_length(result, 2)
})

# Test 1.5
test_that("first element of output has the name 'status_code'", {
  result <- spotify_token()
  expect_true("status_code" %in% names(result))
})

# Test 1.6
test_that("class of 'status_code' is numeric", {
  result <- spotify_token()
  expect_is(result$status_code, "integer")  # "numeric" yerine "integer" kullanılmalı
})

# Test 1.7
test_that("value of 'status_code' is 200", {
  result <- spotify_token()
  expect_equal(result$status_code, 200)
})

# Test 1.8
test_that("second element of output has the name 'token'", {
  result <- spotify_token()
  expect_true("token" %in% names(result))
})

# Test 1.9
test_that("class of 'token' is character", {
  result <- spotify_token()
  expect_is(result$token, "character")
})

# Test 1.10
test_that("token starts with 'Bearer '", {
  result <- spotify_token()
  expect_true(startsWith(result$token, "Bearer "))
})

library(testthat)

# Test 1.11
test_that("token has 122 characters", {
  result <- spotify_token()
  expect_equal(nchar(result$token), 122)
})