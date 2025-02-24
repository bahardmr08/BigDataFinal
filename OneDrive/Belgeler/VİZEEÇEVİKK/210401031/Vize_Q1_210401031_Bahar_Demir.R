library(httr)

#1

spotify_token <- function(){
  # Spotify API'ye erişim için gerekli bilgiler
  readRenviron("./.Renviron")
  client_id <- Sys.getenv("SPOTIFY_ID")
  client_secret <- Sys.getenv("SPOTIFY_SECRET")
  
  # Token almak için gerekli endpoint ve parametreler
  token_url <- "https://accounts.spotify.com/api/token"
  grant_type <- "client_credentials"
  
  # Token almak için POST isteği gönderme
  response <- POST(
    token_url,
    authenticate(client_id, client_secret),
    body = list(grant_type = grant_type),
    encode = "form"
  )
  
  # HTTP status kodunu al
  status_code <- status_code(response)
  
  # Response JSON içerisinden token'ı al
  token <- content(response)$access_token
  
  # Bearer token string oluştur
  bearer_token <- paste("Bearer", token, sep = " ")
  
  # Sonuçları liste olarak döndür
  result <- list(status_code = status_code, token = bearer_token)
  return(result)
  
}

#2
spotify_search_artist <- function(artist_name) {
  # Spotify API'ye erişim için gerekli token'ı al
  token_result <- spotify_token()
  
  # Token alma işlemi başarılı değilse hatayı döndür
  if (token_result$status_code != 200) {
    return(token_result)
  }
  
  # Token'ı alınan değeri kullan
  access_token <- token_result$token
  
  # Authorization başlığını doğru bir şekilde oluştur
  headers <- c("Authorization" = access_token)
  
  # Artist araması için endpoint ve parametreler
  search_url <- "https://api.spotify.com/v1/search"
  search_type <- "artist"
  
  # GET isteği için parametreleri belirle
  params <- list(q = artist_name, type = search_type)
  
  # Artist araması yapmak için GET isteği gönder
  response <- GET(search_url, add_headers(headers), query = params)
  
  # HTTP status kodunu al
  status_code <- status_code(response)
  
  if (status_code == 200) {
    # Response JSON içerisinden artistlerin isim ve ID bilgilerini çek
    artist_data <- content(response)$artists
    if (length(artist_data$items) > 0) {
      artists_df <- data.frame(artist = sapply(artist_data$items, function(artist) artist$name),
                               id = sapply(artist_data$items, function(artist) artist$id))
      
      # Sonuçları liste olarak döndür
      result <- list(status_code = status_code, search_results = artists_df)
    } else {
      # Hata durumunda status code'u ve hata mesajını çıktıya ekleyerek sonuçları liste olarak döndür
      error_message <- "No artists found."
      result <- list(status_code = status_code, error = error_message)
    }
    
    # Sonuçları liste olarak döndür
    result <- list(status_code = status_code, search_results = artists_df)
  } else {
    # Hata durumunda status code'u ve hata mesajını çıktıya ekleyerek sonuçları liste olarak döndür
    error_message <- content(response)$error$message
    result <- list(status_code = status_code, error = error_message)
  }
  
  return(result)
}

# token <- spotify_token()
# print(token)

artist <- spotify_search_artist("The Doors")
print(artist)