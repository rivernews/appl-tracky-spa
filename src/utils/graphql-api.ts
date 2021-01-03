import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from "@apollo/client"
import { Company } from "../data-model/company/company";
import { labelTypes } from "../data-model/label";
import { AuthenticationService } from "./authentication"

type IGraphQLQueryResult<Schema> = {
    // TODO: add single response typing
    [key in "companies"]: IGraphQLQueryListResponse<Schema>;
}

export interface IGraphQLQueryListResponse<Schema> {
    edges: Array<{ node: Schema }>;
    count: number;
    totalCount: number;
    pageInfo: {
        endCursor: string
    }
}

interface IPaginatedQueryArgs {
    after?: string;
}

interface ICompaniesQueryArgs extends IPaginatedQueryArgs {
    labels__text?: labelTypes;
    labels__isnull?: boolean;
}

export type IGraphQLQueryArgs = ICompaniesQueryArgs;

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

    fetchDashboardCompanyData = ({
        after = '',
        ...args
    }: ICompaniesQueryArgs) => {
        const signatureArgs = (Object.keys(args) as Array<keyof typeof args>).reduce((acc, cur) => {
            const value = args[cur];
            switch (typeof value) {
                case 'string':
                    return `${acc}, ${cur}: "${value}"`;
                default:
                    return `${acc}, ${cur}: ${value}`;
            }
        }, '');

        return this.apolloClient.query<IGraphQLQueryResult<Company>>({
            query: gql`
                query {
                    companies(first:50, order_by: "-modified_at", after: "${after}" ${signatureArgs}) {
                        totalCount
                        count
                        pageInfo {
                            startCursor
                            endCursor
                        }
                        edges {
                            node {
                                uuid
                                name
                                labels {
                                    text
                                }
                                applications {
                                    uuid
                                    position_title
                                }
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
