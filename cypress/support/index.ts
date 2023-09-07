export {}
declare global {
    namespace Cypress {
        interface Chainable {
            login(displayName:string, uid:string): Chainable<void>;
            navigateTo(destination: 'Administrar Clínicas' | 'Administar Pacientes' | 'Reportes' | 'Otros Ajustes'): Chainable<void>;
        }
    }
}