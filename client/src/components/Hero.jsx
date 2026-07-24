import Button from "./common/Button/Button";

function Hero() {
  return (
    <section className="hero">
      <h1>Find Your Dream Job</h1>
      <p>
        Search thousands of jobs from top companies and
        apply with one click.
     </p>
      <div className="hero-buttons">
        <button>Search Jobs</button>
        <button variant="secondary">
           Browse Jobs
        </button>
      </div>
    </section>
  );
}
export default Hero;