const subtotalCents = 1000;
const taxPercent = 20;
const totalCents = subtotalCents + subtotalCents * taxPercent / 100;

process.stdout.write(
  `Total: $${(totalCents / 100).toFixed(2)}\n`,
);
