// 1. Create Default Admin User & Guru Profile
const salt = await bcrypt.genSalt(10);
const adminPasswordHash = await bcrypt.hash('YourNewPasswordHere', salt); // <-- Replace with your desired password

const adminUser = await User.create({
  username: 'admin',
  name: 'Guru Smt. Rukmini Viswanathan',
  email: 'gsilambarasan54@gmail.com', // <-- Updated to your email
  password: adminPasswordHash,
  role: 'admin',
  phone: '+91 98400 12345',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
});