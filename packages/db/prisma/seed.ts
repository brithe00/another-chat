import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options?: any
) => Promise<Buffer>;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
});
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");

  const N = 16384;
  const r = 16;
  const p = 1;
  const keylen = 64;
  const maxmem = 128 * N * r * 2;

  const derivedKey = await scryptAsync(
    password.normalize("NFKC"),
    salt,
    keylen,
    {
      N,
      r,
      p,
      maxmem,
    }
  );

  return `${salt}:${derivedKey.toString("hex")}`;
}

const models = [
  // OpenAI Models
  {
    provider: "openai",
    modelId: "gpt-4o",
    displayName: "GPT-4o",
    description: "OpenAI's most advanced model with multimodal capabilities",
    isActive: true,
  },
  {
    provider: "openai",
    modelId: "gpt-4o-mini",
    displayName: "GPT-4o Mini",
    description: "Smaller, faster, and more affordable version of GPT-4o",
    isActive: true,
  },
  {
    provider: "openai",
    modelId: "gpt-4-turbo",
    displayName: "GPT-4 Turbo",
    description: "High-performance GPT-4 model with enhanced capabilities",
    isActive: true,
  },
  {
    provider: "openai",
    modelId: "gpt-3.5-turbo",
    displayName: "GPT-3.5 Turbo",
    description: "Fast and cost-effective model for most tasks",
    isActive: true,
  },
  {
    provider: "ollama",
    modelId: "llava:latest",
    displayName: "LLaVA",
    description: "LLaVA latest from Ollama",
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  console.log("👤 Creating demo user...");
  const existingUser = await prisma.user.findUnique({
    where: { email: "demo@example.com" },
  });

  if (!existingUser) {
    const demoUserId = randomBytes(16).toString("hex");
    const hashedPassword = await hashPassword("demo1234");

    await prisma.user.create({
      data: {
        id: demoUserId,
        name: "Demo User",
        email: "demo@example.com",
        emailVerified: true,
      },
    });

    await prisma.account.create({
      data: {
        id: randomBytes(16).toString("hex"),
        accountId: demoUserId,
        providerId: "credential",
        userId: demoUserId,
        password: hashedPassword,
      },
    });

    console.log("✅ Demo user created:");
    console.log("   📧 Email: demo@example.com");
    console.log("   🔑 Password: demo1234");
  } else {
    console.log("ℹ️  Demo user already exists, skipping creation");
  }

  console.log("🗑️  Clearing existing models...");
  await prisma.model.deleteMany({});

  console.log("📦 Seeding models...");
  for (const model of models) {
    await prisma.model.upsert({
      where: {
        provider_modelId: {
          provider: model.provider,
          modelId: model.modelId,
        },
      },
      update: {},
      create: model,
    });
  }

  console.log(`✅ Seeded ${models.length} models`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

{
  /*
    


  const models = [

  // Anthropic Models
  {
    provider: "anthropic",
    modelId: "claude-opus-4-5-20251101",
    displayName: "Claude Opus 4.5",
    description: "Most powerful Claude model for complex tasks",
    isActive: true,
  },
  {
    provider: "anthropic",
    modelId: "claude-sonnet-4-5-20250929",
    displayName: "Claude Sonnet 4.5",
    description: "Balanced performance and speed",
    isActive: true,
  },
  {
    provider: "anthropic",
    modelId: "claude-3-5-haiku-20241022",
    displayName: "Claude 3.5 Haiku",
    description: "Fastest Claude model for simple tasks",
    isActive: true,
  },
    // Google Models
  {
    provider: "google",
    modelId: "gemini-2.0-flash-exp",
    displayName: "Gemini 2.0 Flash (Experimental)",
    description: "Google's latest experimental flash model",
    isActive: true,
  },
  {
    provider: "google",
    modelId: "gemini-1.5-pro",
    displayName: "Gemini 1.5 Pro",
    description: "High-performance model with large context window",
    isActive: true,
  },
  {
    provider: "google",
    modelId: "gemini-1.5-flash",
    displayName: "Gemini 1.5 Flash",
    description: "Fast and efficient for everyday tasks",
    isActive: true,
  },
  // xAI Models
  {
    provider: "xai",
    modelId: "grok-2-1212",
    displayName: "Grok 2",
    description: "xAI's powerful language model",
    isActive: true,
  },
  {
    provider: "xai",
    modelId: "grok-2-vision-1212",
    displayName: "Grok 2 Vision",
    description: "Grok with vision capabilities",
    isActive: true,
  },

  // Mistral Models
  {
    provider: "mistral",
    modelId: "mistral-large-latest",
    displayName: "Mistral Large",
    description: "Mistral AI's most capable model",
    isActive: true,
  },
  {
    provider: "mistral",
    modelId: "mistral-small-latest",
    displayName: "Mistral Small",
    description: "Compact and efficient Mistral model",
    isActive: true,
  },

  // Perplexity Models
  {
    provider: "perplexity",
    modelId: "llama-3.1-sonar-large-128k-online",
    displayName: "Sonar Large 128k Online",
    description: "Large model with internet access",
    isActive: true,
  },
  {
    provider: "perplexity",
    modelId: "llama-3.1-sonar-small-128k-online",
    displayName: "Sonar Small 128k Online",
    description: "Efficient model with internet access",
    isActive: true,
  },

  // DeepSeek Models
  {
    provider: "deepseek",
    modelId: "deepseek-chat",
    displayName: "DeepSeek Chat",
    description: "DeepSeek's conversational AI model",
    isActive: true,
  },
  {
    provider: "deepseek",
    modelId: "deepseek-reasoner",
    displayName: "DeepSeek Reasoner",
    description: "Specialized model for complex reasoning tasks",
    isActive: true,
  },
  ]  



    */
}
