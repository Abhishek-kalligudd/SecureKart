export async function checkLocationAnomaly(ip: string, declaredCountry: string) {
  // 1. Handle localhost dev environment
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
    console.log("Skipping location check for localhost")
    return { isMismatch: false, detectedCountry: declaredCountry }
  }

  // Helper function to standardize country codes (ensure strictly 2 letters)
  const formatCountry = (code: string) => (code ? code.toUpperCase().slice(0, 2) : "UNKNOWN")

  try {
    // -----------------------------------------
    // ATTEMPT 1: ipapi.co
    // -----------------------------------------
    console.log(`Checking location for IP: ${ip} via ipapi.co...`)
    const response1 = await fetch(`https://ipapi.co/${ip}/json/`)
    
    if (response1.ok) {
      const data = await response1.json()
      if (data.country_code) {
        const detectedCountry = formatCountry(data.country_code)
        console.log(`Primary API success: Detected ${detectedCountry}`)
        return { 
          isMismatch: detectedCountry !== declaredCountry, 
          detectedCountry 
        }
      }
    } else {
      console.warn("Primary Location API failed, trying backup...")
    }

    // -----------------------------------------
    // ATTEMPT 2: ipwho.is (Backup)
    // -----------------------------------------
    console.log(`Checking location for IP: ${ip} via ipwho.is...`)
    const response2 = await fetch(`https://ipwho.is/${ip}`)
    const data2 = await response2.json()

    if (data2.success) {
      const detectedCountry = formatCountry(data2.country_code)
      console.log(`Backup API success: Detected ${detectedCountry}`)
      return { 
        isMismatch: detectedCountry !== declaredCountry, 
        detectedCountry 
      }
    }

    // If both fail
    console.error("All location APIs failed.")
    return { isMismatch: false, detectedCountry: "API_ERROR" }

  } catch (error) {
    console.error("Location check service error:", error)
    // Fail open (allow order) if service is down
    return { isMismatch: false, detectedCountry: "ERROR" }
  }
}