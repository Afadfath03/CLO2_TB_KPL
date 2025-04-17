// Load app asli
const app = require("./TaskManagement_tubes_sem6-main/app");
const languageMiddleware = require("./middleware/languageMiddleware");

// Gunakan middleware bahasa
app.use(languageMiddleware);

// (opsional) Contoh route tambahan yang pakai req.t()
app.get("/langtest", (req, res) => {
  res.send(req.t("welcome"));
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
