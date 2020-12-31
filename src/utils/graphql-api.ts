import { ApolloClient, ApolloLink, ApolloQueryResult, concat, createHttpLink, gql, InMemoryCache } from "@apollo/client"
import { Company } from "../data-model/company/company";
import { AuthenticationService } from "./authentication"

interface CompanyGraphQLQueryResult {
    companies: {
        edges: Array<{ node: Company }>,
        count: number,
        totalCount: number
    }
}

export class GraphQLApi {
    state = {
        apiBaseUrl: (process.env.NODE_ENV === 'development') ? 
        `http://localhost:8000/graphql/`
        :
        `https://appl-tracky.api.shaungc.com/graphql/`
    }

    // customizing apollo's fetch logic
    // https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-request-logic
    apolloClient = new ApolloClient({
        link: concat(
            new ApolloLink((operation, forward) => {
                operation.setContext({
                    credentials: AuthenticationService.apiCallToken ? "include" : "omit",
                    headers: {
                        Authorization: AuthenticationService.apiCallToken
                            ? `JWT ${AuthenticationService.apiCallToken}`
                            : ``,
                    },
                });
    
                return forward(operation);
            }),
            createHttpLink({
                uri: this.state.apiBaseUrl,
            })
        ),
        headers: {
            "Content-Type": "application/json"
        },
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                fetchPolicy: 'no-cache'
            }
        }
    })

    fetchDashboardCompanyData = () => {
        return this.apolloClient.query<CompanyGraphQLQueryResult>({
            query: gql`
                query {
                    companies(first:2, orderBy: "-modified_at") {
                        totalCount
                        count
                        pageInfo {
                            startCursor
                            endCursor
                        }
                        edges {
                            node {
                                name
                            }
                        }
                    }
                }
            `,
        }).then((res) => {
            const { edges, ...normalizedResponse} = res.data.companies;

            return {
                ...normalizedResponse,
                results: edges.map(edge => edge.node)
            };
        })
    }
}

export const GraphQLApiService = new GraphQLApi();
