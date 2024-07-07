import React from 'react';
import { CORE_CONCEPTS } from "./data";
import { CoreConcepts } from './components/CoreConsepts';
import { Header } from './components/Header';

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core concepts</h2>
          <ul>
            {CORE_CONCEPTS.map((coreConcept, index) => (
              <CoreConcepts
                key={index}
                image={coreConcept.image}
                title={coreConcept.title}
                description={coreConcept.description}
              />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
