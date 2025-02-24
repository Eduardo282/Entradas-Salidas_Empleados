const BASE_URL = "https://horarios.gestionesculturales.org/";

export async function getRecords() {
  const response = await fetch(`${BASE_URL}/php/getRecords.php`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json(); // Assumes the API returns a JSON array of ExitRecord objects.
}
