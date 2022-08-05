import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { SecretService } from 'src/secret/secret.service';
import { stringify } from 'qs';
import { PaypalAuthResponse } from './dto/auth-response.dto';
import { PAYPAL_API_ENDPOINTS } from './paypal.constants';
<<<<<<< HEAD
import { CreateOnboardingDTO } from './dto/onboarding-create-dto';
=======
>>>>>>> 3a109d55ac403d32303941909d2eb4e509c66717

// https://developer.paypal.com/developer/applications/edit/SB:QVlKY0IxbXJJc29fUFc0OS0tUEJNeldlUk9KQnVMM0g4X0FzUTY3SlpXRWViMS1FNVNPTjNQUVp5azluRnNHdnlFT1ZGMVpiUzVxVVB1c2U=?appname=Platform%20Partner%20App%20-%205349654246137804925

@Injectable()
export class PaypalService {
  #secretKey: string;
  #apiUrl: string;
  #apiClientId: string;

  constructor(private readonly secretService: SecretService) {
    const { url, clientId, secret } = this.secretService.getPayPalSecrets();
    this.#apiClientId = clientId;
    this.#apiUrl = url;
    this.#secretKey = secret;
  }

  async #getAccessToken(): Promise<PaypalAuthResponse> {
    const auth = new Axios({
      baseURL: this.#apiUrl,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
      },
      auth: {
        username: this.#apiClientId,
        password: this.#secretKey,
      },
    });

    const res = await auth.post(
      PAYPAL_API_ENDPOINTS.ACCESS_TOKEN,
      stringify({
        grant_type: 'client_credentials',
      }),
    );

    const { scope, ...data } = JSON.parse(res.data);
    const responseData: PaypalAuthResponse = {
      ...data,
      scope: (scope as string).split(' '),
    };

    return responseData;
  }

  async #getAuthenticatedAxiosInstance(): Promise<Axios> {
    const { access_token }: PaypalAuthResponse = await this.#getAccessToken();

    return new Axios({
      baseURL: this.#apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });
  }

  async getCredentials() {
    return this.#getAccessToken();
  }

<<<<<<< HEAD
  async generateOnboardingUrl(additional: CreateOnboardingDTO) {
    const { tracking_id } = additional;

    const tracker = {
      ...(tracking_id && {
        tracking_id,
      }),
    };

    const authAxios = await this.#getAuthenticatedAxiosInstance();

    const bodyParams = {
      ...tracker,
      partner_config_override: {
        return_url: this.secretService.getPayPalOnboardingRedirectUrl(),
      },
=======
  async generateOnboardingUrl() {
    const authAxios = await this.#getAuthenticatedAxiosInstance();

    const bodyParams = {
>>>>>>> 3a109d55ac403d32303941909d2eb4e509c66717
      operations: [
        {
          operation: 'API_INTEGRATION',
          api_integration_preference: {
            rest_api_integration: {
              integration_method: 'PAYPAL',
              integration_type: 'THIRD_PARTY',
              third_party_details: {
                features: ['PAYMENT', 'REFUND'],
              },
            },
          },
        },
      ],
      products: ['EXPRESS_CHECKOUT'],
      legal_consents: [
        {
          type: 'SHARE_DATA_CONSENT',
          granted: true,
        },
      ],
    };

    const result = await authAxios.post(
      PAYPAL_API_ENDPOINTS.GENERATE_ONBOARD_LINK,
      JSON.stringify(bodyParams),
    );

<<<<<<< HEAD
    return JSON.parse(result.data);
=======
    return result.data;
>>>>>>> 3a109d55ac403d32303941909d2eb4e509c66717
  }
}
