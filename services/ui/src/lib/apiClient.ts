export type DeckStatus = "draft" | "live";
export type DeckRole = "admin" | "presenter" | "viewer";

export interface DeckMember {
  id: string;
  email: string;
  role: DeckRole;
  status?: "active" | "invited";
  invitedAt?: string;
  joinedAt?: string;
}

export interface DeckSlide {
  id: string;
  deckId: string;
  title: string;
  content: string;
  order: number;
  updatedAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  status: DeckStatus;
  ownerEmail: string;
  members: DeckMember[];
  slides: DeckSlide[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeckPayload {
  name: string;
  description?: string;
}

export interface UpdateDeckMetadataPayload {
  name?: string;
  description?: string | null;
  status?: DeckStatus;
}

export interface AddDeckMemberPayload {
  email: string;
  role: DeckRole;
}

export interface UpdateDeckMemberRolePayload {
  role: DeckRole;
}

export interface UpsertSlidePayload {
  title: string;
  content: string;
  order?: number;
}

export interface CopilotRequestPayload {
  prompt: string;
  code: string;
}

export interface CopilotResponse {
  response: string;
}

export interface DecklabApiClient {
  listDecks(forceRefresh?: boolean): Promise<Deck[]>;
  getDeck(deckId: string): Promise<Deck>;
  createDeck(payload: CreateDeckPayload): Promise<Deck>;
  updateDeck(deckId: string, payload: UpdateDeckMetadataPayload): Promise<Deck>;
  deleteDeck(deckId: string): Promise<void>;

  addDeckMember(deckId: string, payload: AddDeckMemberPayload): Promise<Deck>;
  updateDeckMemberRole(
    deckId: string,
    memberId: string,
    payload: UpdateDeckMemberRolePayload
  ): Promise<Deck>;
  removeDeckMember(deckId: string, memberId: string): Promise<Deck>;

  createSlide(deckId: string, payload: UpsertSlidePayload): Promise<DeckSlide>;
  updateSlide(
    deckId: string,
    slideId: string,
    payload: UpsertSlidePayload
  ): Promise<DeckSlide>;
  deleteSlide(deckId: string, slideId: string): Promise<void>;
}

export interface ApiClientOptions {
  baseUrl?: string;
  getAccessToken?: () => Promise<string | undefined>;
  mockDelayMs?: number;
  seedDecks?: DeckWithSlides[];
}

type DeckWithSlides = Deck;

export function createApiClient(
  options: ApiClientOptions = {},
  mode: "http" | "mock" = "mock"
): DecklabApiClient {
  if (mode === "mock") {
    return new MockApiClient(options);
  }
  throw new Error(`Unsupported API client mode: ${mode}`);
}

class MockApiClient implements DecklabApiClient {
  constructor(options: ApiClientOptions) {
    // Implementation of the mock API client constructor
  }

  async listDecks(forceRefresh?: boolean): Promise<Deck[]> {
    // Mock implementation
    return [];
  }

  async getDeck(deckId: string): Promise<Deck> {
    // Mock implementation
    return {} as Deck;
  }

  async createDeck(payload: CreateDeckPayload): Promise<Deck> {
    // Mock implementation
    return {} as Deck;
  }

  async updateDeck(
    deckId: string,
    payload: UpdateDeckMetadataPayload
  ): Promise<Deck> {
    // Mock implementation
    return {} as Deck;
  }

  async deleteDeck(deckId: string): Promise<void> {
    // Mock implementation
  }

  async addDeckMember(
    deckId: string,
    payload: AddDeckMemberPayload
  ): Promise<Deck> {
    // Mock implementation
    return {} as Deck;
  }

  async updateDeckMemberRole(
    deckId: string,
    memberId: string,
    payload: UpdateDeckMemberRolePayload
  ): Promise<Deck> {
    // Mock implementation
    return {} as Deck;
  }

  async removeDeckMember(deckId: string, memberId: string): Promise<Deck> {
    // Mock implementation
    return {} as Deck;
  }

  async createSlide(
    deckId: string,
    payload: UpsertSlidePayload
  ): Promise<DeckSlide> {
    // Mock implementation
    return {} as DeckSlide;
  }

  async updateSlide(
    deckId: string,
    slideId: string,
    payload: UpsertSlidePayload
  ): Promise<DeckSlide> {
    // Mock implementation
    return {} as DeckSlide;
  }

  async deleteSlide(deckId: string, slideId: string): Promise<void> {
    // Mock implementation
  }
}
