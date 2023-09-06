export {}
declare global {
    namespace Cypress {
        interface Chainable {
            login(displayName:string, uid:string): Chainable<void>;
        }
    }
}