const webserviceSample = require("./webservice_sample.js");

describe("webservice_sample", () => {
  describe("getCredentials", () => {
    it("should return credentials object with all required properties", () => {
      const credentials = webserviceSample.getCredentials();

      expect(credentials).toBeDefined();
      expect(credentials).toHaveProperty("customerAlias");
      expect(credentials).toHaveProperty("databaseAlias");
      expect(credentials).toHaveProperty("userId");
      expect(credentials).toHaveProperty("password");
      expect(credentials).toHaveProperty("clientId");
      expect(credentials).toHaveProperty("clientSecret");
    });

    it("should return expected credential values", () => {
      const credentials = webserviceSample.getCredentials();

      expect(credentials.customerAlias).toBe("VisualVault");
      expect(credentials.databaseAlias).toBe("Example");
      expect(credentials.userId).toBe("API_KEY");
      expect(credentials.password).toBe("API_SECRET");
      expect(credentials.clientId).toBe("API_KEY");
      expect(credentials.clientSecret).toBe("API_SECRET");
    });
  });

  describe("main", () => {
    let mockVvClient;
    let mockResponse;
    let mockToken;

    beforeEach(() => {
      mockVvClient = {};
      mockResponse = {
        json: jest.fn(),
      };
      mockToken = "test-token";
    });

    it("should call response.json with 200 status and success message", () => {
      webserviceSample.main(mockVvClient, mockResponse, mockToken);

      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith(
        200,
        "COMMUNICATION ARRIVED SUCCESSFULLY.  THIS IS A CUSTOM MESSAGE COMING BACK FROM THE NODEJS SERVER.",
      );
    });

    it("should handle being called with valid parameters", () => {
      expect(() => {
        webserviceSample.main(mockVvClient, mockResponse, mockToken);
      }).not.toThrow();
    });
  });
});
