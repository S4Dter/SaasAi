/* eslint-disable */
// @ts-nocheck
// This is a mock implementation of the Prisma client for build time only
// It prevents the "Prisma Client did not initialize yet" errors during build

class MockPrismaClient {
  constructor() {
    // Create mock models with CRUD operations
    this.user = this.createMockModel();
    this.agent = this.createMockModel();
    this.category = this.createMockModel();
    this.report = this.createMockModel();
    this.systemSetting = this.createMockModel();
    this.agentView = this.createMockModel();
    this.agentClick = this.createMockModel();
    this.agentContact = this.createMockModel();
    this.revenue = this.createMockModel();
    this.payout = this.createMockModel();
    this.activity = this.createMockModel();
    this.agent_views = this.createMockModel();
    this.system_settings = this.createMockModel();
  }

  createMockModel() {
    return {
      findMany: async () => [],
      findUnique: async () => null,
      findFirst: async () => null,
      create: async (data) => data.data,
      update: async (data) => data.data,
      delete: async () => ({}),
      count: async () => 0,
      aggregate: async () => ({ _count: 0, _sum: { amount: 0 } }),
      groupBy: async () => [],
      upsert: async (data) => data.create,
    };
  }

  $use(middleware) {
    // No-op for the mock
  }
}

// Export a singleton instance
const prismaClientSingleton = () => new MockPrismaClient();
const prisma = prismaClientSingleton();
export default prisma;
