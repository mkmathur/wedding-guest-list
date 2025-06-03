import styles from './App.module.css'

function App() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Wedding Guest List</h1>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className={styles.quickActions}>
        <div className={styles.quickActionsContent}>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton}>
              + New Household
            </button>
            <button className={styles.secondaryButton}>
              Export
            </button>
          </div>
          <div>
            Total Guests: 0
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.panels}>
          {/* Left Panel - Categories & Tiers */}
          <div className={styles.leftPanel}>
            <h2 className={styles.panelTitle}>Categories & Tiers</h2>
            {/* Content will be added in next phase */}
          </div>

          {/* Middle Panel - Household List */}
          <div className={styles.middlePanel}>
            <h2 className={styles.panelTitle}>Households</h2>
            {/* Content will be added in next phase */}
          </div>

          {/* Right Panel - Scenarios */}
          <div className={styles.rightPanel}>
            <h2 className={styles.panelTitle}>Scenarios</h2>
            {/* Content will be added in next phase */}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
